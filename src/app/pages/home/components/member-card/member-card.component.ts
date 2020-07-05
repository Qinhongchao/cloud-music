import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { User } from 'src/app/data-types/member.types';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {

  @Output() openModal=new EventEmitter<void>();
  @Input() user:User;
  constructor() { }

  ngOnInit(): void {
  }

}
