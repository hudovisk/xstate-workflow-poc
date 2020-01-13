import Event from "../domain/event";

interface EventRepository {
  create(event: Event): Promise<Event>;

  update(event: Event): Promise<Event>;
}

export default EventRepository;
