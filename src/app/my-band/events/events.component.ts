import { OnInit, Component } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { MyBandService } from 'src/app/core/services/my-band.service';
import { AlertService } from 'src/app/core/services';
import { Event } from 'src/app/core/model/event';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

const colors: any = {
  green: {
    primary: '#28a745',
    secondary: '#12e44365'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  eventForm: FormGroup;
  modalTitle: string;
  currentDate: Date;
  activeDayIsOpen: boolean = false;
  isNew: boolean = true;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  dbEvents: Event[] = [];
  removedEvent: CalendarEvent;
  editedEvent: CalendarEvent;
  openedEvent: Event;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editedEvent = event;
        this.eventForm = this.formBuilder.group({
          title: event.title,
          start: formatDate(event.start, 'yyyy-MM-dd', 'en'),
          description: this.dbEvents.find(ev => event.id == ev.id).description,
          end: event.end != null ? formatDate(event.end, 'yyyy-MM-dd', 'en') : null
        });
        this.modal.open(this.newEvent, {size: 'lg', centered: true});
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.removedEvent = event;
        this.modal.open(this.confirm, { size: 'sm', centered: true });
      }
    }
  ];

  @ViewChild('newEvent') newEvent: TemplateRef<any>;
  @ViewChild('openEvent') openEvent: TemplateRef<any>;
  @ViewChild('confirm') confirm: TemplateRef<any>;

  constructor(private modal: NgbModal,
              private bandService: MyBandService,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
                this.currentDate = new Date();
              }
  
  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.bandService.getEvents().subscribe(
      data => {
        this.dbEvents = data;
        this.convertEvents(data);
        this.refresh.next();
      },
      () => this.alertService.error("Failed to get events!")
    );
  }

  convertEvents(eventArray: Event[]) {
    this.events = [];
    for (let i=0; i<eventArray.length; i++) {
      const convertedEvent: CalendarEvent = {
        id: eventArray[i].id,
        title: eventArray[i].title,
        start: startOfDay(eventArray[i].start),
        end: eventArray[i].end != null ? endOfDay(eventArray[i].end) : null,
        color: eventArray[i].type === "Short" ? colors.green : colors.yellow,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
      }
      this.events.push(convertedEvent);
    };
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
    if (!this.events.find(event => date.getDate() === event.start.getDate())){
      this.isNew = true;
      this.eventForm = this.formBuilder.group({
        title: ['', Validators.required],
        start: ['', Validators.required],
        description: ['', Validators.required],
        end: ''
      });
      this.modal.open(this.newEvent, { size: 'lg', centered: true });
    }
  }

  eventClicked(event: CalendarEvent) {
      this.openedEvent = this.dbEvents.find(ev => event.id === ev.id);
      this.modal.open(this.openEvent, { size: 'lg', centered: true });
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    const timeChangedEvent: Event = this.dbEvents.find(ev => event.id == ev.id);
    timeChangedEvent.start = newStart;
    timeChangedEvent.end = newEnd;
    this.bandService.editEvent(timeChangedEvent).subscribe(
      data => {
        this.alertService.success("Saved!");
        this.getEvents();
      },
      () => this.alertService.error("Failed to save event!")
    )
  }

  editEvent(eventToEdit: CalendarEvent) {
    const event: Event = {
      id: <number>eventToEdit.id,
      title: eventToEdit.title,
      start: eventToEdit.start,
      end: eventToEdit.end != null ? eventToEdit.end : null,
      type: "",
      description: this.dbEvents.find(ev => eventToEdit.id === ev.id).description
    }
    this.bandService.editEvent(event).subscribe(
      data => {
        this.alertService.success("Saved!");
        this.getEvents();
      },
      () => this.alertService.error("Failed to save event!")
    )
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const id = <number>eventToDelete.id;
    this.bandService.deleteEvent(id).subscribe(
      data => {
        this.alertService.success("Event deleted!");
        this.getEvents();
        this.activeDayIsOpen = false;
      },
      () => this.alertService.error("Failed to delete event!")
    )
  }

  changeToEdit(event: Event) {
    this.isNew = false;
    this.editedEvent = event;
    this.eventForm = this.formBuilder.group({
      title: event.title,
      start: formatDate(event.start, 'yyyy-MM-dd', 'en'),
      description: this.dbEvents.find(ev => event.id == ev.id).description,
      end: event.end != null ? formatDate(event.end, 'yyyy-MM-dd', 'en') : null
    });
    this.modal.open(this.newEvent, {size: 'lg', centered: true});
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  save() {
    const saveEvent : Event = {
      id: this.isNew ? null : <number>this.editedEvent.id,
      title : this.eventForm.value.title,
      description: this.eventForm.value.description,
      start: this.eventForm.value.start,
      end: this.eventForm.value.end,
      type: null
    };

    if (this.isNew) {
      this.bandService.addEvent(saveEvent).
          subscribe(
              () => {
                  this.alertService.success('Success!', true);
                  this.getEvents();
                  this.activeDayIsOpen = false;
              },
              error => this.alertService.error("Failed to save event!")
          );
    } else {
      this.bandService.editEvent(saveEvent).subscribe(
        () => {
          this.alertService.success("Success!", true);
          this.getEvents();
          this.activeDayIsOpen = false;
        },
        error => this.alertService.error("Failed to save event!")
      )
    }
  }
}