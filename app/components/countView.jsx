import { Badge } from "@shopify/polaris";
import React from "react";

function CountView(props) {
  const { title, count, tone } = props;

  return (
    <div className="tag-and-count">
      <div className="rounded-count">
        <span className="count-text">{count}</span>
      </div>
      <Badge tone={tone}>{title}</Badge>
    </div>
  );
}

export default CountView;
