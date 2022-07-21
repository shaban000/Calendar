import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  max = 100;
  guesses: Map<String, any> | null = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    await fetch('http://localhost:3000/api/game/calendar/data', {
      method: 'GET',
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((data) => {
        this.guesses = new Map(Object.entries(data));
      })
      .catch(function (error) {
        console.log('error', error);
      });
  }

  counter() {
    return new Array(this.max);
  }

  checkIfGuessed(x: number, y: number) {
    if (this.guesses == null) return false;
    const key = `${x},${y}`;
    return this.guesses.has(key);
  }

  async newGuess(x: number, y: number) {
    const data = {
      x: x,
      y: y,
    };

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return alert('U moet eerst inloggen.');

    await fetch('http://localhost:3000/api/game/calendar/guess', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        this.guesses = new Map(Object.entries(data.guesses));
        if (data.win) alert(`Gefeliciteerd u heeft €${data.amount} gewonnen.`);
      })
      .catch(function (error) {
        console.log('error', error);
      });
  }
}
