import Card from "@c/Card";
import Mobile from "./mobile";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import leftArrow from "@/static/left.png";
import rightArrow from "@/static/right.png";
import { WL_DATA, PUBLIC_DATA, initPrices } from "@/constants";
import { addressHaveHexProof } from "@u/handleMerkleTree";

import "swiper/swiper-bundle.css";
import "./index.less";

let timer;

interface Iprops {
  currentAccount: string;
  handleConnect: Function;
  isTargetNetwork: boolean;
  contract: any;
  isMobile: Boolean;
  tab: number;
  setMessage: Function;
}

const Home = (props: Iprops) => {
  const [my_swiper, set_my_swiper] = useState({} as any); //swiper
  const [counts, setCounts] = useState([1, 1, 1, 1]);
  const [prices, setPrices] = useState([0.05, 0.03, 0, 0.07]);
  const [checkeds, setCheckeds] = useState([false, false, false, false]);
  const [supplys, setSupplys] = useState([0, 0, 0, 0]);

  
  useEffect(() => {
    const arr = [
      addressHaveHexProof(props.currentAccount, 0),
      addressHaveHexProof(props.currentAccount, 1),
      addressHaveHexProof(props.currentAccount, 2),
      true,
    ];
    setCheckeds(arr);
  }, [props.currentAccount]);

  useEffect(() => {
    const arr = counts.map((item, index) => {
      return Number((item * initPrices[index]).toFixed(2));
    });
    setPrices(arr);
  }, counts);

  useEffect(() => {
    timer = setInterval(() => {
      getSupplys(props.contract);
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, [props.contract]);

  const getSupplys = async (contract) => {
    let res;
    if (!contract?.minteds1) {
      return;
    }
    try {
      res = await Promise.all([
        contract?.minteds1(),
        contract?.minteds2(),
        contract?.minteds3(),
        contract?.minteds4(),
      ]);
      if (res) {
        res = res.map((item) => item.toNumber());
      }
    } catch (e) {
      console.error(e);
    }
    setSupplys(res || [0, 0, 0, 0]);
  };

  return (
    <div className="content">
      {props.isMobile ? (
        <Mobile
          currentAccount={props.currentAccount}
          counts={counts}
          isMobile={props.isMobile}
          setCounts={setCounts}
          checkeds={checkeds}
          prices={prices}
          supplys={supplys}
          contract={props.contract}
          setMessage={props.setMessage}
        />
      ) : (
        <>
          <span
            className="slide_prev"
            onClick={() => {
              my_swiper.slidePrev();
            }}
            style={{
              display: props.tab === 0 && !props.isMobile ? "block" : "none",
            }}
          >
            <img src={leftArrow} alt="" />
          </span>

          <div className="content_main">
            {props.tab === 0 ? (
              //white_list
              <div className="swiper_wrap">
                <Swiper
                  slidesPerView={1}
                  onInit={(ev) => {
                    set_my_swiper(ev);
                  }}
                  spaceBetween={20}
                  loop
                  allowTouchMove={props.isMobile ? true : false}
                >
                  {WL_DATA.map((item, index) => {
                    return (
                      <div key={index}>
                        <SwiperSlide>
                          <Card
                            item={item}
                            currentAccount={props.currentAccount}
                            counts={counts}
                            index={index}
                            setCounts={setCounts}
                            isMobile={props.isMobile}
                            deadline={item.deadline}
                            checkeds={checkeds}
                            supplys={supplys}
                            prices={prices}
                            setMessage={props.setMessage}
                            contract={props.contract}
                          />
                        </SwiperSlide>
                      </div>
                    );
                  })}
                </Swiper>
              </div>
            ) : (
              //public
              <div className="swiper_wrap">
                <div>
                  <SwiperSlide>
                    <Card
                      item={PUBLIC_DATA}
                      currentAccount={props.currentAccount}
                      counts={counts}
                      index={3}
                      isMobile={props.isMobile}
                      setCounts={setCounts}
                      deadline={PUBLIC_DATA.deadline}
                      checkeds={checkeds}
                      supplys={supplys}
                      prices={prices}
                      contract={props.contract}
                      setMessage={props.setMessage}
                    />
                  </SwiperSlide>
                </div>
              </div>
            )}
          </div>

          <span
            className="slide_next"
            onClick={() => {
              my_swiper.slideNext();
            }}
            style={{
              display: props.tab === 0 && !props.isMobile ? "block" : "none",
            }}
          >
            <img src={rightArrow} alt="" />
          </span>
        </>
      )}
    </div>
  );
};

export default Home;
