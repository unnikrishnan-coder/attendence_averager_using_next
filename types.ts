export type Subject = {
    id?:string
    name: string
    total: number
    attended : number
    uid : string
  }

export enum AlertTypes{
  info = "INFO",
  success = "SUCCESS",
  error = "ERROR",
  warning = "WARNING"
}