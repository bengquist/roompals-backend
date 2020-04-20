import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
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

  @Field(() => User)
  @OneToOne(() => User)
  admin: User;

  @Field(() => [Chore])
  @OneToMany(() => Chore, (chore) => chore)
  chores: Chore[];

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.group)
  users: User[];
}
