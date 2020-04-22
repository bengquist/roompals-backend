import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { UserGroup } from "./UserGroup";

@Entity()
@ObjectType()
export class Chore extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("text")
  title: string;

  @Field(() => String)
  @Column("text")
  emoji: string;

  @Field(() => String)
  @Column("text")
  cycleDate: string;

  @Field(() => Boolean)
  @Column("bool", { default: false })
  isCompleted: false;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.chores)
  user: User;

  @Field(() => UserGroup)
  @ManyToOne(() => UserGroup, (group) => group.chores)
  group: UserGroup;
}
