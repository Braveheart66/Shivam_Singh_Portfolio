import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.96, 1] : [1.03, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.45], isMobile ? [6, 0] : [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.45], isMobile ? [15, 0] : [40, 0]);

  return (
    <div
      className="min-h-fit md:min-h-[60rem] flex items-center justify-center relative p-1 sm:p-4 md:p-10 mb-10 md:mb-16 last:mb-0"
      ref={containerRef}
    >
      <div
        className="py-4 md:py-16 w-full relative"
        style={{
          perspective: isMobile ? "800px" : "1200px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: { translate: MotionValue<number>; titleComponent: any }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-6xl mx-auto mb-6 text-left"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 0 1px rgba(0, 243, 255, 0.15), 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 243, 255, 0.1)",
      }}
      className="max-w-6xl -mt-4 mx-auto w-full border border-border/80 p-3 sm:p-5 md:p-8 bg-card/95 backdrop-blur-2xl rounded-[28px] shadow-2xl transition-colors duration-300 relative overflow-hidden"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-secondary/20 border border-border/50 p-4 sm:p-6 md:p-8 relative">
        {children}
      </div>
    </motion.div>
  );
};
