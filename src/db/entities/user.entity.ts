import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageEntity, ChatEntity } from '.';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, length: 90 })
  email: string;

  @Column('varchar', { length: 100, nullable: true })
  password: string;

  // messages
  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  // chats
  @ManyToMany(() => ChatEntity, (chat) => chat.users)
  chats: ChatEntity[];

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
