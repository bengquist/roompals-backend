import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chore } from "./Chore";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserGroup extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  code: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  admin: User;

  @Field(() => [Chore])
  @OneToMany(() => Chore, (chore) => chore.group, {
    cascade: true,
  })
  chores: Chore[];

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.group, {
    cascade: true,
  })
  users: User[];
}
