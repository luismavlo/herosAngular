import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img{
      width: 80%;
      border-radius: 5px;
      margin-left: 10%
    }
    
  `]
})
export class AgregarComponent implements OnInit {

  publisher = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  }

  constructor( private heroesServices: HeroesService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private snackBar: MatSnackBar,
               public dialog: MatDialog) { }

  ngOnInit(): void {
    
    if( !this.router.url.includes('editar')){
      return
    }

    this.activatedRoute.params
        .pipe(
          switchMap(({id}) => this.heroesServices.getHeroePorId( id ))
        )
        .subscribe(heroe => this.heroe = heroe)
  }

  guardar(){
    if( this.heroe.superhero.trim().length === 0){
      return;  
    }

    if( this.heroe.id ){
      this.heroesServices.actualizarHeroe(this.heroe)
        .subscribe( heroe => this.mostrarSnackbar('Registro actualizado'));
    }else{
      this.heroesServices.agregarHeroe(this.heroe)
      .subscribe( heroe => {
        this.router.navigate(['/heroes/editar', heroe.id]);
        this.mostrarSnackbar('Registro creado')
      })
    }
  }

  borrarHeroe(){

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      result => {
        if( result ){
          this.heroesServices.borrarHeroe( this.heroe )
            .subscribe( resp => {
              this.router.navigate(['/heroes']);
            });
        }
      }
    )


  }

  mostrarSnackbar( mensaje: string ){
    this.snackBar.open( mensaje, 'Ok!', {
      duration: 2500
    });
  }
}
