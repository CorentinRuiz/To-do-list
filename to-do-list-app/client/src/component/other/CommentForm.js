import React from "react";
import Button from 'react-bootstrap/Button'
import './css/commentForm.css'
const CommentForm = ({ comment, setComment, sendComment }) => {
  return (
    <div id="formComment">
    <div className="form">
      <textarea rows="2" cols="20"
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="input"
      />
    </div>
    <Button  id="sendComment" onClick={sendComment}>
       Send Comment
   </Button>
   </div>
  );
};

export default CommentForm;