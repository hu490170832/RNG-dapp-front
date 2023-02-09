import { useEffect, useState } from "react";
import moment from "moment";
import handleddl from "@u/handleddl";
export interface ICountdown {
  deadline: string;
  format?: "YYYY-MM-DD HH:mm:ss" | string;
}
export type Remains = Record<"day" | "hour" | "minute" | "second", number>;

const useCountdown = ({
  deadline,
  format = "YYYY-MM-DD HH:mm:ss",
}: ICountdown): Remains => {
  const [current, setCurrent] = useState(moment());

  const [remains, setRemains] = useState<Remains>({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });

  useEffect(() => {
    refresh(deadline);
    const timer = window.setInterval(() => {
      setCurrent(moment());
      current.isSameOrAfter(moment(deadline, format))
        ? clearInterval(timer)
        : refresh(deadline);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const refresh = (deadline) => {
    let millisec = moment(deadline, format).valueOf() - moment().valueOf();
    millisec = millisec >= 0 ? millisec : 0;
    setRemains({
      day: handleddl(Math.floor(millisec / (1000 * 60 * 60 * 24))),
      hour: handleddl(Math.floor((millisec / (1000 * 60 * 60)) % 24)),
      minute: handleddl(Math.floor((millisec / (1000 * 60)) % 60)),
      second: handleddl(Math.round((millisec / 1000) % 60)),
    });
  };

  return remains;
};

export default useCountdown;
