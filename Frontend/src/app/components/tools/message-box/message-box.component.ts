import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
} from '@angular/core';
import { AppState } from '../../../shared/store/app.state';
import { Store } from '@ngrx/store';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  catchError,
  from,
  map,
  mergeMap,
  of,
  throwError,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import * as UC from '@uploadcare/file-uploader';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import { OutputFileEntry } from '@uploadcare/file-uploader';
import { selectChatData } from '../../../shared/store/Chat/chat.selectors';
import * as userActions from '../../../shared/store/userData/userData.actions';
import * as chatActions from '../../../shared/store/Chat/chat.actions';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { error } from 'console';
import e from 'express';
import { LoaderComponent } from '../loader/loader.component';

UC.defineComponents(UC);
@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    LoaderComponent,
  ],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MessageBoxComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  OpenedChat: { chatId: string; participants: string[] } | null = null;
  user!: any;
  messageText: string = '';
  messagesArray: {
    name: string;
    message: string;
    time: string;
    status: string;
    senderId: string;
  }[] = [];
  isChatImgClicked: boolean = false;
  cklickedChatImg!: string;
  emojiArr: { character: string }[] = [];
  isEmojiClickOpened: boolean = false;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
    InstanceType<UC.UploadCtxProvider>
  >;
  getChatMembersName: { name: string; id: string }[] = [];
  chatInfo: { name: string; img: string; status: boolean }[] = [];
  files: any[] = [];
  clickedChat!: string;
  isMessagesLoaded: boolean = false;
  isOptionsClicked: boolean = false;
  EmojiSubsription!: Subscription;
  isChatInfoLoaded: boolean = false;
  isEmojisLoaded: boolean = false;
  constructor(
    private store: Store<AppState>,
    private friendReqS: FriendRequestService
  ) {}

  ngOnInit() {
    this.ctxProviderRef.nativeElement.addEventListener(
      'change',
      this.handleUploadEvent
    );
    this.store.select(selectUserData).subscribe((res) => {
      if (res.data && !Array.isArray(res.data)) {
        this.user = res.data;
      }
    });
    this.isChatInfoLoaded = true;
    this.friendReqS.chatCheck$.subscribe(
      (data: { chatId: string; participants: string[] } | null) => {
        if (data) {
          this.OpenedChat = data;
          this.friendReqS.JoinInChat(this.OpenedChat.chatId);
          this.messagesArray = [];
          if (this.OpenedChat.participants.length > 1) {
            this.store.select(selectChatData).subscribe((data: any) => {
              if (data) {
                console.log(data);
                this.chatInfo = [];
                this.isChatInfoLoaded = false;
                this.chatInfo.push({
                  name: data.chatName,
                  img: 'assets/groupChatImg.png',
                  status: true,
                });
              }
            });
          } else {
            this.friendReqS
              .getFriendData(this.OpenedChat.participants[0])
              .pipe(
                catchError((error: HttpErrorResponse) => {
                  return throwError(() => error);
                })
              )
              .subscribe(
                (res) => {
                  if (Array.isArray(res.data)) {
                    this.messagesArray = [];
                    this.chatInfo = [];
                    this.chatInfo.push(res.data[0]);
                    this.isChatInfoLoaded = false;
                  } else {
                    this.chatInfo = [];
                  }
                },
                (error) => {
                  console.log('Caught error:', error);
                }
              );
          }
          //getChatMessages
          if (this.OpenedChat?.chatId) {
            this.isMessagesLoaded = false;
            this.friendReqS
              .getChatmessages(this.OpenedChat?.chatId)
              .pipe(
                catchError((error: HttpErrorResponse) => {
                  return throwError(error);
                })
              )
              .subscribe(
                (res) => {
                  if (res && res.data) {
                    let Data = res.data;
                    if (Array.isArray(Data)) {
                      Data.forEach((sender) => {
                        this.messagesArray.push({
                          name: sender.senderName,
                          message: sender.message,
                          time: sender.createdAt as string,
                          status: 'sent',
                          senderId: sender.senderId,
                        });
                      });
                      this.isMessagesLoaded = true;
                    }
                  }
                },
                (error) => {
                  console.log(error);
                }
              );
          }
        } else this.OpenedChat = null;
      }
    );
    this.friendReqS.receivedMessage().subscribe((messagedata) => {
      if (messagedata && this.user?._id === messagedata?.senderId) {
        if (this.messagesArray || Array.isArray(this.messagesArray)) {
          this.isMessagesLoaded = true;
          if (messagedata.status === 'sent') {
            this.messagesArray.pop();
          }
          this.messagesArray.push({
            name: this.user?.name,
            message: messagedata.message,
            time: messagedata.createdAt,
            status: messagedata.status,
            senderId: messagedata.senderId,
          });
        }
      } else console.log(messagedata);
    });
    this.friendReqS.listenForMessagesInChat().subscribe((data: any) => {
      if (data) {
        this.messagesArray.push({
          name: data.senderName,
          message: data.message,
          time: data.createdAt as string,
          status: 'sent',
          senderId: data.senderId,
        });
        this.isMessagesLoaded = true;
      }
    });
    this.isEmojisLoaded = true;
    this.friendReqS
      .getAllEmoji()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
      .subscribe(
        (data) => {
          if (Array.isArray(data)) {
            data.forEach((emoji) => {
              this.emojiArr.push({
                character: emoji.character,
              });
            });
            this.isEmojisLoaded = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ngOnDestroy(): void {
    if (this.EmojiSubsription) this.EmojiSubsription.unsubscribe();
  }
  sendMessageClick(input: string) {
    if (this.OpenedChat?.chatId && input.trim() !== '')
      this.friendReqS.sendMessage(
        this.OpenedChat?.chatId,
        this.user?._id,
        this.user?.name,
        input
      );
    this.messageText = '';
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    const container = this.messageContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  emojiOpenClick() {
    this.isEmojiClickOpened = !this.isEmojiClickOpened;
  }
  emojiClick(emoji: string) {
    // Combine all HTML codes for the emoji
    // const combinedEmoji = emoji
    //   .map((code) => {
    //     const decimalCode = parseInt(
    //       code.replace('&#', '').replace(';', ''),
    //       10
    //     );
    //     return String.fromCodePoint(decimalCode);
    //   })
    //   .join('');
    this.messageText += emoji;
  }
  handleUploadEvent = (e: UC.EventMap['change']) => {
    this.files = e.detail.allEntries.filter(
      (f) => f.status === 'success'
    ) as OutputFileEntry<'success'>[];
    if (this.files.length > 0) {
      this.sendMessageClick(this.files[0].cdnUrl);
    }
  };
  chatImgClick(imgUrl: string, bool: boolean) {
    this.isChatImgClicked = bool;
    if (imgUrl.trim() !== '') this.cklickedChatImg = imgUrl;
  }
  optionsClick() {
    this.isOptionsClicked = !this.isOptionsClicked;
  }
  deleteChatClick() {
    const chatId = this.OpenedChat?.chatId;
    const userId =
      this.chatInfo[0]?.name !== '' ? this.chatInfo[0]?.name : this.user?._id;
    let participants: string[] | undefined = this.OpenedChat?.participants;
    participants?.push(this.user?._id);
    if (chatId && Array.isArray(participants)) {
      this.friendReqS
        .deleteChat(chatId, participants, userId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          })
        )
        .subscribe(
          (res) => {
            if (res) {
              this.store.dispatch(userActions.userData());
              this.store.dispatch(chatActions.chatData({ data: [] }));
              this.friendReqS.saveChatDataInLocalStorage('', []);
              this.isOptionsClicked = false;
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
