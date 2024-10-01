import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { AppState } from '../../../shared/store/app.state';
import { Store } from '@ngrx/store';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, from, map, mergeMap, of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import * as UC from '@uploadcare/file-uploader';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import { OutputFileEntry } from '@uploadcare/file-uploader';
import { selectChatData } from '../../../shared/store/Chat/chat.selectors';
UC.defineComponents(UC);
@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MessageBoxComponent implements OnInit, AfterViewChecked {
  OpenedChat: { chatId: string; participants: string[] } | null = null;
  user!: any;
  chatData!: any;
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
  emojiArr: { htmlCodes: string[]; unicode: string[] }[] = [];
  isEmojiClickOpened: boolean = false;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
    InstanceType<UC.UploadCtxProvider>
  >;
  chatInfo: { name: string; img: string; status: boolean }[] = [];
  files: any[] = [];
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
    this.friendReqS.chatCheck$.subscribe(
      (data: { chatId: string; participants: string[] } | null) => {
        if (data) {
          this.OpenedChat = data;
          this.friendReqS.JoinInChat(this.OpenedChat.chatId);
          if (this.OpenedChat.participants.length > 1) {
            this.store.select(selectChatData).subscribe((data: any) => {
              if (data) {
                this.chatInfo = [];
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
                  } else {
                    this.chatInfo = [];
                  }
                },
                (error) => console.log('Caught error:', error)
              );
          }
          this.chatMessageFunction();
        } else this.OpenedChat = null;
      }
    );
    // this.chatMessageFunction();
    this.friendReqS.receivedMessage().subscribe((messagedata) => {
      if (messagedata && this.user?._id === messagedata?.senderId) {
        if (Array.isArray(this.messagesArray)) {
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
        // console.log(this.messagesArray);
      } else console.log(messagedata);
    });
    this.friendReqS.listenForMessagesInChat().subscribe((data: any) => {
      if (data) {
        this.findFriendNameForMessage(data);
        this.messagesArray.push({
          name: this.chatInfo[0]?.name,
          message: data.message,
          time: data.createdAt as string,
          status: 'sent',
          senderId: data.senderId,
        });
      }
    });
    this.friendReqS.getAllEmoji().subscribe((data) => {
      if (Array.isArray(data)) {
        data.filter((emoji) => {
          this.emojiArr.push({
            htmlCodes: emoji.htmlCode,
            unicode: emoji.unicode,
          });
        });
      }
    });
  }

  sendMessageClick(input: string) {
    if (this.OpenedChat?.chatId && input.trim() !== '')
      this.friendReqS.sendMessage(
        this.OpenedChat?.chatId,
        this.user?._id,
        input
      );
    this.messageText = '';
  }
  chatMessageFunction(): void {
    this.friendReqS
      .getChatmessages(this.OpenedChat?.chatId as string)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            let Data = res.data;
            if (Array.isArray(Data)) {
              Data.filter((msg) => {
                this.friendReqS
                  .getFriendData(msg.senderId)
                  .pipe(
                    catchError((error: HttpErrorResponse) => {
                      return throwError(() => error);
                    })
                  )
                  .subscribe(
                    (res) => {
                      if (res && res.data) {
                        const senderName = res.data[0]?.name;
                        if (msg?.senderId === this.user?._id) {
                          console.log(1);
                          this.messagesArray.push({
                            name: senderName,
                            message: msg.message,
                            time: msg.createdAt as string,
                            status: 'sent',
                            senderId: msg.senderId,
                          });
                        } else {
                          this.messagesArray.push({
                            name: senderName,
                            message: msg.message,
                            time: msg.createdAt as string,
                            status: 'sent',
                            senderId: msg.senderId,
                          });
                        }
                      }
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
              });
            }
          }
        },
        (error) => {
          this.messagesArray = [];
          console.log(error);
        }
      );
  }
  findFriendNameForMessage(msg: any) {
    this.friendReqS
      .getFriendData(msg.senderId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            const senderId = res.data?._id;
            const senderName = res.data?.name;
            console.log(senderId);

            this.messagesArray.push({
              name: senderName,
              message: msg.message,
              time: msg.createdAt as string,
              status: 'sent',
              senderId: senderId,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
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
  emojiClick(emoji: { htmlCodes: string[]; unicode: string[] }) {
    // Combine all HTML codes for the emoji
    const combinedEmoji = emoji.htmlCodes
      .map((code) => {
        const decimalCode = parseInt(
          code.replace('&#', '').replace(';', ''),
          10
        );
        console.log(decimalCode);
        return String.fromCodePoint(decimalCode);
      })
      .join('');

    this.messageText += combinedEmoji;
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
}
