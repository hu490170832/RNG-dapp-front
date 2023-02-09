import Card from "@c/Card";
import { WL_DATA, PUBLIC_DATA } from "@/constants";
import "./index.less";
interface Iprops {
  currentAccount: string;
  contract: any;
  isMobile: Boolean;
  setMessage: Function;
  setCounts: Function;
  counts: Array<number>;
  checkeds: Array<boolean>;
  prices: Array<number>;
  supplys: Array<number>;
}

export default function App({
  currentAccount,
  counts,
  setCounts,
  isMobile,
  checkeds,
  prices,
  supplys,
  contract,
  setMessage,
}: Iprops) {
  return (
    <div className="mobile_container">
      {WL_DATA.map((item, index) => {
        return (
          <div key={index}>
            <Card
              item={item}
              currentAccount={currentAccount}
              counts={counts}
              index={index}
              setCounts={setCounts}
              isMobile={isMobile}
              deadline={item.deadline}
              checkeds={checkeds}
              prices={prices}
              supplys={supplys}
              contract={contract}
              setMessage={setMessage}
            />
          </div>
        );
      })}

      <Card
        item={PUBLIC_DATA}
        currentAccount={currentAccount}
        counts={counts}
        index={3}
        setCounts={setCounts}
        isMobile={isMobile}
        checkeds={checkeds}
        prices={prices}
        deadline={PUBLIC_DATA.deadline}
        supplys={supplys}
        contract={contract}
        setMessage={setMessage}
      />
    </div>
  );
}
