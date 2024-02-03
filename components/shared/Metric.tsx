import Image from "next/image";
import Link from "next/link";

interface MetricProps {
  icon: string;
  alt: string;
  title: string;
  textStyles?: string;
  value: string | number;
  href?: string;
  isAuthor?: boolean;
  titlePosition?: "left" | "right";
}

const Metric = ({ icon, alt, title, textStyles, value, isAuthor, href, titlePosition }: MetricProps) => {
  const metricContent = (
    <>
      {icon ? <Image src={icon} alt={alt} width={16} height={16} className={`object-contain ${href ? "rounded-full" : ""}`} /> : ""}
      <p className={`text-dark300_light700 p-0 m-0 flex items-center gap-1 ${textStyles}`}>
        {titlePosition === "left" ? <span className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden  " : ""}`}> {title}</span> : ""}
        {value}
        {titlePosition !== "left" ? <span className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden  " : ""}`}> {title}</span> : ""}
      </p>
    </>
  );

  if (href)
    return (
      <Link href={href} className="flex items-center gap-1">
        {metricContent}
      </Link>
    );

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
