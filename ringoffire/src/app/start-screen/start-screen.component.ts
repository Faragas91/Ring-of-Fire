import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  private firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    // This method is called when the component is initialized
    // You can perform any necessary setup here
  }

  newGame(id: string):void {
    this.router.navigateByUrl(`/game/${id}`);
  }

  async addGame(): Promise<void> {
    const newGameInstance = new Game();
    try {
      const docRef = await addDoc(collection(this.firestore, 'games'), newGameInstance.toJson());
      this.newGame(docRef.id);
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Spiels:", err);
    }
  }
}
