import { useEffect, useState } from "react";

export default function useAutoScroll(ref: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // 스크롤 핸들러 함수
  const handleScroll = () => {
    const element = ref.current;
    if (!element) return;

    const threshold = 100;
    const isBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    setIsAutoScroll(isBottom);
  };

  // 스크롤 이벤트
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (isAutoScroll) {
      const el = ref.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [isAutoScroll, ...deps]);

  return { isAutoScroll };
}

/**
ref: 스크롤 감지, 조작할 DOM
deps: 새 메시지가 들어올 때 스크롤을 아래로 내리기 위함
isAutoScroll: 자동 스크롤이 현재 켜져 있는지 판단
 */
