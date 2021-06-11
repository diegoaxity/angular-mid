import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns = ['avatar', 'name', 'email', 'actions'];
  dataSource = new MatTableDataSource<User>();

  constructor(
    private userSvc: UserService,
    private dataSvc: DataService,
    private router: Router
  ) {
    this.dataSvc.isLoading.next(true);
    this.userSvc.getUsers().subscribe(
      (res) => {
        this.dataSource.data = res.data;
        this.dataSvc.isLoading.next(false);
      },
      (err) => {
        this.dataSvc.message.next(
          'Lo sentimos ocurrió un error al cargar los usuarios'
        );
        this.dataSvc.isLoading.next(false);
      }
    );
  }

  ngOnInit(): void {}

  goToUser(user: User) {
    this.router.navigate(['/user', user.id]);
  }
}
