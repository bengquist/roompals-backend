import { Field, InputType } from "type-graphql";

@InputType()
export class CreateChoreInput {
  @Field()
  title: string;

  @Field()
  ownerId: string;

  @Field()
  groupId: string;

  @Field()
  emoji: string;

  @Field()
  cycleDate: string;
}
