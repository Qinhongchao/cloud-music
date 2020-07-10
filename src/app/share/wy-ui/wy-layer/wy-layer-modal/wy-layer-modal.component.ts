import { DOCUMENT } from '@angular/common';

import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { Overlay, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayContainer } from '@angular/cdk/overlay';
import { getMember, getModalVisible, getModalType } from './../../../../store/selectors/member.selector';
import { AppStoreModule } from './../../../../store/index';
import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, ViewChild, AfterViewInit, Renderer2, Inject, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { ESCAPE } from '@angular/cdk/keycodes'
import { domain } from 'process';
import { WINDOW } from 'src/app/services/services.module';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('showHide', [
    state('show', style({ transform: 'scale(1)', opacity: 1 })),
    state('hide', style({ transform: 'scale(0)', opacity: 0 })),
    transition('show<=>hide', animate("0.1s"))
  ])]
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  private visible: boolean = false;
  public currentModalType: ModalTypes = ModalTypes.Default;
  private overlayRef: OverlayRef;

  public showModal: 'show' | 'hide' = 'hide';
  private scrollStrategy: BlockScrollStrategy;
  private overlayContainerEl; OverlayContainer;

  @ViewChild('modalContainer', { static: true }) private modalRef: ElementRef;

  private resizeHandler: () => void;
  @Output() onLoadMySheets = new EventEmitter<void>();

  constructor(
    @Inject(WINDOW) private win: Window,
    @Inject(DOCUMENT) private doc: Document,
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsService: BatchActionsService,
    private rd: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(getModalVisible)).subscribe(visible => {
      this.watchModalVisible(visible)
    })

    appStore$.pipe(select(getModalType)).subscribe(type => {
      this.watchModalType(type);
    })

    this.scrollStrategy = this.overlay.scrollStrategies.block();

  }
  ngAfterViewInit(): void {
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
    this.listenResizeToCenter();


  }
  listenResizeToCenter() {
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () => {
      this.keepCenter(modal, modalSize);
    })
  }


  keepCenter(modal: HTMLElement, size: { w: number, h: number }) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }


  getWindowSize() {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientHeight || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientWidth || this.doc.body.clientHeight
    }
  }


  getHideDomSize(dom: HTMLElement) {
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    }
  }

  watchModalVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible;
      this.handleVisibleChange(this.visible);
    }

  }
  handleVisibleChange(visible: boolean) {


    if (visible) {
      this.showModal = 'show';
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
      this.changePointerEvents('auto');
    } else {
      this.showModal = 'hide';
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler();
      this.changePointerEvents('none');

    }

    this.cdr.markForCheck();

  }
  changePointerEvents(type: 'none' | 'auto') {
    if (this.overlayContainerEl) {
      this.overlayContainerEl.style.pointerEvents = type;
    }
  }

  watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {

      if (type === ModalTypes.Like) {
        this.onLoadMySheets.emit();
      }
      this.currentModalType = type;
      this.cdr.markForCheck();
    }

  }

  ngOnInit(): void {

    this.createOverlay();
  }

  createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e => this.keydownListener(e))
  }


  keydownListener(evt: KeyboardEvent): void {

    if (evt.keyCode === ESCAPE) {
      this.hide();
    }
  }

  hide() {
    this.batchActionsService.controlModal(false)
  }



}
