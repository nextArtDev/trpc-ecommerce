interface HeadingProps {
  title: string
  description: string
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="space-y-3 pr-2 md:pr-4">
      <h2 className="text-sm md:text-lg xl:text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <p className="text-xs md:text-sm xl:text-base text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
