import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, ManyToMany } from 'typeorm';
import { MinLength, MaxLength } from 'class-validator';
import { AppUser } from './AppUser';
import { ListRestaurant } from './ListRestaurant';

@Entity()
export class PersonalList extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @MinLength(1, {
        message: 'List Name has to be between 1 and 100 characters',
      })
      @MaxLength(100, {
        message: 'List Name has to be between 1 and 100 characters',
      })
    
    @Column()
    listName: string

    @ManyToOne(() => AppUser, (user:AppUser) => user.id,{ onDelete: 'CASCADE' }) @JoinColumn()
    userID: AppUser

    // @ManyToMany(() => ListRestaurant, (listRestaurant:ListRestaurant) => listRestaurant.id,)
    // listRestaurant: ListRestaurant

    @ManyToMany(() => ListRestaurant,   listRestaurnat => listRestaurnat.personalList)
    listRestaurants: ListRestaurant[]

}