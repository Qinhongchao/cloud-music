import { takeUntil } from 'rxjs/internal/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, forwardRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {  Subject, fromEvent } from 'rxjs';
import { BACKSPACE } from '@angular/cdk/keycodes';

const CODELEN=4;

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['./wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[{
    provide:NG_VALUE_ACCESSOR,
    useExisting:forwardRef(()=>WyCodeComponent),
    multi:true
  }
   
  ]
})
export class WyCodeComponent implements OnInit,ControlValueAccessor,AfterViewInit,OnDestroy {

  inputArr=[];
  code:string;
  inputEl:HTMLElement[];
   destroy$=new Subject();
   currentFocusIndex=0;
   result:string[]=[];
  @ViewChild('codeWrap',{static:true}) private codeWrap:ElementRef;

  constructor(private cdr:ChangeDetectorRef) { 

    this.inputArr=Array(CODELEN).fill('');
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  ngAfterViewInit(): void {
    this.inputEl=this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
    
    this.inputEl[0].focus();
    for(let a =0;a<this.inputEl.length;a++){

      const item=this.inputEl[a];
      fromEvent(item,'keyup').pipe(takeUntil(this.destroy$)).subscribe((event:KeyboardEvent)=>this.listenKeyUp(event));
      fromEvent(item,'click').pipe(takeUntil(this.destroy$)).subscribe(()=>{this.currentFocusIndex=a});

    }
  }
  listenKeyUp(event: KeyboardEvent): void {
    const target=<HTMLInputElement> event.target;
    const value=target.value;
    const isBackSpace=event.keyCode===BACKSPACE;
   if(/\D/.test(value)){
     target.value='';
     this.result[this.currentFocusIndex]='';
   }
    if(value){
      this.result[this.currentFocusIndex]=value;
      this.currentFocusIndex=(this.currentFocusIndex+1)%CODELEN;
      this.inputEl[this.currentFocusIndex].focus();
    } else if(isBackSpace){

      this.result[this.currentFocusIndex]='';
      this.currentFocusIndex=Math.max(this.currentFocusIndex-1,0);
      this.inputEl[this.currentFocusIndex].focus();

    }

    this.checkResult(this.result);
  }
  checkResult(result: string[]) {
    const codeStr=result.join('');
    this.setValue(codeStr);
  }
  writeValue(value: string): void {
    this.setValue(value);
  }
  setValue(code: string) {
    this.cdr.markForCheck();
    this.code=code;
    this.onValueChange(code);
  }

  private onValueChange(value:string):void{

  }

  private onTouched():void{

  }


  registerOnChange(fn: ()=>void): void {
    this.onValueChange=fn;
  }
  registerOnTouched(fn: ()=>void): void {
    this.onTouched=fn;
  }
 

  ngOnInit(): void {
  }

}
