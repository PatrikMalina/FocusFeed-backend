declare module '@ioc:Repositories/MessageRepository' {
  export interface SerializedMessage {
    id: number
    chatId: number
    createdBy: number
    content: string
    createdAt: string
  }

  export interface MessageRepositoryContract {
    getAll(chatId: number, paging: number): Promise<SerializedMessage[]>
    create(chatId: number, userId: number, content: string): Promise<SerializedMessage | null>
  }

  const MessageRepository: MessageRepositoryContract
  export default MessageRepository
}
