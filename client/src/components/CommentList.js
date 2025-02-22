import React from 'react';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;

    switch (comment.status) {
      case 'rejected':
        content = <i>This comment has been rejected.</i>;
        break;
      case 'pending':
        content = <i>This comment is waiting moderation.</i>;
        break;
      case 'approved':
      default:
        content = comment.content;
    }

    return <p key={comment.id}>{content}</p>
  });

  return (
    <ul>
      {renderedComments}
    </ul>
  );
}

export default CommentList;