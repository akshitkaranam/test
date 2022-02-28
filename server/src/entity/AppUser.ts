import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, MinLength, MaxLength } from 'class-validator';
import { PersonalList } from './PersonalList';

@Entity()
export class AppUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  email: string;

  @MinLength(1, {
    message: 'First Name has to be between 1 and 30 characters',
  })
  @MaxLength(30, {
    message: 'First Name has to be between 1 and 30 characters',
  })
  @Column()
  firstName: string;

  @MinLength(1, {
    message: 'Last Name has to be between 1 and 30 characters',
  })
  @MaxLength(30, {
    message: 'Last Name has to be between 1 and 30 characters',
  })
  @Column()
  lastName: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt:Date;

  @OneToMany(() => PersonalList, (list:PersonalList) => list.id) 
  public list: PersonalList
  

  
}
