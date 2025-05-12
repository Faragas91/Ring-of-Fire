import { Component, inject, OnInit } from '@angular/core';
import { Game } from './../../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, doc, addDoc, updateDoc,  getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard = '';
  game!: Game;
  gameId: string = '';
  gameOver: boolean = false;

  private firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.loadGame(this.gameId); 
    });
  }

  loadGame(gameId: string): void {
    const gameRef = doc(this.firestore, 'games', gameId);
    getDoc(gameRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const gameData = docSnapshot.data();
        this.game = new Game(); 
        this.game.images = gameData['images'] || [];
        this.game.players = gameData['players'] || [];
        this.game.stack = gameData['stack'] || [];
        this.game.playedCards = gameData['playedCards'] || [];
        this.game.currentPlayer = gameData['currentPlayer'] || 0;
      } else {
        console.log('Spiel existiert nicht');
      }
    }).catch((error) => {
      console.log('Fehler beim Laden des Spiels:', error);
    });
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);

    addDoc(collection(this.firestore, 'games'), this.game.toJson());
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else{
      if (!this.pickCardAnimation) {
        this.currentCard = this.game.stack.pop() || '';
        this.pickCardAnimation = true;
        
        this.game.currentPlayer++;
        if (this.game.currentPlayer >= this.game.players.length) {
          this.game.currentPlayer = 0;
        }
        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 1000);
        this.updateGame();
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.images.push('1.webp');
        this.updateGame();
      }
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  updateGame() {
    const gameRef = doc(this.firestore, 'games', this.gameId);
    updateDoc(gameRef, {
      images: this.game.images,
      players: this.game.players, 
      stack: this.game.stack,     
      playedCards: this.game.playedCards, 
      currentPlayer: this.game.currentPlayer,
    })
  }

  editPlayer(playerId: number) {
    console.log('Player', playerId);

    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe(change => {
    if (change == 'DELETE') {
      this.game.images.splice(playerId, 1);
      this.game.players.splice(playerId, 1);
    } else {
      this.game.images[playerId] = change;
    }
    this.updateGame();
    });
  }
}
