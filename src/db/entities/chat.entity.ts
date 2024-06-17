import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageEntity, UserEntity } from '.';

export enum Room {
  private = 0,
  public = 1,
}

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, length: 90 })
  username: string;

  // messages
  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  // users
  @ManyToMany(() => UserEntity, (user) => user.chats)
  @JoinTable()
  users: UserEntity[];

  @Column({ type: 'enum', enum: Room, default: Room.public })
  roomType: Room;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
