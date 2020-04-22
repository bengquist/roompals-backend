import { Field, InputType } from "type-graphql";

@InputType()
export class CreateChoreInput {
  @Field()
  title: string;

  @Field()
  ownerId: number;

  @Field()
  groupId: number;

  @Field()
  emoji: string;

  @Field()
  cycleDate: string;
}
