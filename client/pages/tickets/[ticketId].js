import useRequest from '../../hooks/useRequest';

const Ticket = ({ ticket }) => {

  const { call, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (_) => console.log(_),
  });

  return (
    <div className="container my-5">
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <hr />
      {errors}
      <button className="btn btn-primary" onClick={call}>Purchase</button>
    </div>
  );
}

Ticket.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default Ticket;