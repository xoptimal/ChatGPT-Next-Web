"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检测页面滚动事件
    window.onscroll = function () {
      if (document.documentElement.scrollTop > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  }, []);

  // 点击按钮滚动到页面顶部

  return (
    <>
      {isVisible && (
        <FloatButton icon={<ArrowUpOutlined />} onClick={scrollToTop} />
      )}
    </>
  );
}

export default ScrollToTopButton;

export { scrollToTop };
