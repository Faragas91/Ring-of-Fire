import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    // This method is called when the component is initialized
    // You can perform any necessary setup here
  }

  newGame() {
    this.router.navigateByUrl('/game');
  }
}
