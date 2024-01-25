export type Flags = number

export const NoFlags = 0b0000001
export const PlaceMent = 0b0000010
export const Update = 0b0000100
export const ChildDeletion = 0b0001000

export const MutationMask = PlaceMent | Update | ChildDeletion
