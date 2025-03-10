import { Ticket } from '../ticket';

describe('Ticket Model', () => {
  it('should implement optimistic concurrency control', async () => {
    const ticket = Ticket.build({ title: 'ticket1', price: 5, userId: 'userId' });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
      await secondInstance!.save();
    } catch (error) {
      return;
    }

    throw new Error('Should not reach here');
  });

  it('should increment version number on multiple saves', async () => {
    const ticket = Ticket.build({ title: 'ticket1', price: 5, userId: 'userId' });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});