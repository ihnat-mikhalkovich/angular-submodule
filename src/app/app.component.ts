import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Reservation, ReservationRequest, ReservationService } from './reservation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reservation-app';

  constructor(private reservationService: ReservationService) {}

  rooms!: Room[];
  roomSearchForm!: FormGroup;
  currentCheckInVal!: string;
  currentCheckOutVal!: string;
  currentRoomNumber!: number;
  currentPrice!: number;
  currentReservations!: Reservation[];

  ngOnInit() {
    this.roomSearchForm = new FormGroup({
      checkIn: new FormControl(''),
      checkOut: new FormControl(''),
      roomNumber: new FormControl('')
    });
    
    this.roomSearchForm.valueChanges.subscribe(form => {
      this.currentCheckInVal = form.checkIn;
      this.currentCheckOutVal = form.checkOut;

      if (form.roomNumber) {
        let roomValues: string[] = form.roomNumber.split('|');
        this.currentRoomNumber = Number(roomValues[0]);
        this.currentPrice = Number(roomValues[1]);
      }
    });

    this.rooms = [
      new Room("127", "127", "150"),
      new Room("138", "138", "180"),
      new Room("254", "254", "200")
    ];

    this.findAllReservations();
  }

  createReservation() {
    let reservationRequest = new ReservationRequest(
      this.currentRoomNumber,
      this.currentCheckInVal,
      this.currentCheckOutVal,
      this.currentPrice
    );

    this.reservationService.createReservation(reservationRequest)
      .subscribe(postResult => {
        console.log(postResult);
        this.findAllReservations();
      });
  }

  findAllReservations() {
    this.reservationService.findAllReservations()
      .subscribe(getResult => {
        console.log(getResult);
        this.currentReservations = getResult
      });
  }
}

export class Room {
  id: string;
  roomNumber: string;
  price: string;

  constructor(id: string, roomNumber: string, price: string) {
    this.id = id;
    this.roomNumber = roomNumber;
    this.price = price;
  }
}
