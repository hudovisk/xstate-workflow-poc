type EventSender = (
  id: string,
  payload: Record<string, any>,
  profileId?: string
) => Promise<void>;

export default EventSender;
