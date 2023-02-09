import useCountdown from "@/hooks/useCountdown";
import "./index.less";


export default (props: any) => {
  const { day, hour, minute, second } = useCountdown({
    deadline: props.deadline,
  });

  return (
    <div className="ddl_container">
      <div className="ddl_title">Sale Status</div>
      <div className="ddl_content">
        <div className="ddl_item_container">
          <span className="value">{day}</span>
          <span className="name">Days</span>
        </div>
        <div className="ddl_item_container">
          <span className="value">{hour}</span>
          <span className="name">Hour</span>
        </div>
        <div className="ddl_item_container">
          <span className="value">{minute}</span>
          <span className="name">Minute</span>
        </div>
        <div className="ddl_item_container">
          <span className="value">{second}</span>
          <span className="name">Second</span>
        </div>
      </div>
    </div>
  );
};
