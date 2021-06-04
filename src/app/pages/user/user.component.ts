import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user?: User;

  constructor(private actRoute: ActivatedRoute, private userSvc: UserService, private dataSvc: DataService) {
    this.actRoute.params.subscribe(parameters => {
      if (parameters.id) {
        // get user
        this.dataSvc.isLoading.next(true);
        this.userSvc.getUser(parameters.id).subscribe(res => {
          this.user = res.data;
          this.dataSvc.isLoading.next(false);
        }, err => {
          this.dataSvc.isLoading.next(false);
          this.dataSvc.message.next('Lo sentimos, ocurrió un error al cargar el usuario');
        });
      }
    });
  }

  ngOnInit(): void {
  }

}
