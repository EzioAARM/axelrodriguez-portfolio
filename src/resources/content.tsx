import type {
    About,
    Blog,
    Gallery,
    Home,
    Newsletter,
    Person,
    Social,
    Work,
} from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";
import { getHomeContentSafe } from "@/api/home";
import {
    markdownToHtml,
    safeMarkdownToHtml,
    textToHtml,
} from "@/utils/markdown";
import { SimpleHtmlRenderer } from "@/components/SafeHtmlRenderer";
const person: Person = {
    firstName: "Axel",
    lastName: "Rodriguez",
    name: "Axel Rodríguez",
    role: "Software Engineer",
    avatar: "/images/avatar.jpg",
    email: "alejandrom9712@gmail.com",
    location: "America/Guatemala", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    languages: ["English", "Spanish"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
    display: true,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
        name: "GitHub",
        icon: "github",
        link: "https://github.com/EzioAARM",
    },
    {
        name: "LinkedIn",
        icon: "linkedin",
        link: "https://www.linkedin.com/in/axelrm/",
    },
    {
        name: "Instagram",
        icon: "instagram",
        link: "https://www.instagram.com/axel___rodriguez",
    },
    {
        name: "Email",
        icon: "email",
        link: `mailto:${person.email}`,
    },
];

// Static home content (fallback)
const staticHome: Home = {
    path: "/",
    image: "/images/og/home.jpg",
    label: "Home",
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    loading: true,
    headline: "",
    featured: {
        display: false,
        title: "",
        href: "#work",
    },
    subline: "",
    carousel: {
        display: false,
        images: [
            {
                id: "",
                alt: "",
                caption: "",
                url: "",
            },
        ],
    },
};

/**
 * Get home content with Strapi integration
 * Falls back to static content if Strapi is unavailable
 */
export async function getHomePageContent(): Promise<Home> {
    const strapiContent = await getHomeContentSafe();

    if (strapiContent) {
        // Convert the subline to HTML and wrap it in a React element
        const sublineHtml = await markdownToHtml(strapiContent.SubLine);

        return {
            ...staticHome,
            headline: <>{strapiContent.Headline}</>,
            featured: {
                display: strapiContent.HasFeatured,
                title: (
                    <Row gap="12" vertical="center">
                        <strong className="ml-4">
                            {strapiContent.Featured}
                        </strong>{" "}
                        <Line
                            background="brand-alpha-strong"
                            vert
                            height="20"
                        />
                        <Text marginRight="4" onBackground="brand-medium">
                            Featured work
                        </Text>
                    </Row>
                ),
                href: staticHome.featured.href, // Keep the original href
            },
            subline: <SimpleHtmlRenderer html={sublineHtml} />,
            loading: false,
            carousel: {
                display: strapiContent.HasCarousel,
                images: strapiContent.Carousel.map((image) => ({
                    id: image.id.toString(),
                    alt: image.alt,
                    caption: image.caption,
                    url: image.url.formats.large
                        ? image.url.formats.large.url
                        : image.url.url,
                })),
            },
        };
    }

    return staticHome;
}

// Export the static version as default for backward compatibility
const home: Home = staticHome;

const about: About = {
    path: "/about",
    label: "About",
    title: `About – ${person.name}`,
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    tableOfContent: {
        display: true,
        subItems: false,
    },
    avatar: {
        display: true,
    },
    calendar: {
        display: false, // puedes activarlo si usas cal.com u otro servicio
        link: "https://cal.com/axelrm/30min",
    },
    intro: {
        display: true,
        title: "Introduction",
        description: (
            <>
                I'm Axel Rodríguez, a Systems Engineer and Backend Developer
                passionate about building scalable, reliable, and efficient
                cloud-based systems. I specialize in designing APIs, optimizing
                databases, and implementing cloud-native solutions using Azure
                and AWS.
            </>
        ),
    },
    work: {
        display: true,
        title: "Professional Experience",
        experiences: [
            {
                company: "Independent / Freelance",
                timeframe: "2021 - Present",
                role: "Backend Engineer & Cloud Solutions Architect",
                achievements: [
                    <>
                        Designed and deployed microservice-based architectures
                        using .NET, PostgreSQL, and Azure App Service with zero
                        downtime deployment.
                    </>,
                    <>
                        Built ETL pipelines with Apache Airflow for migrating
                        millions of records between SQL Server and PostgreSQL.
                    </>,
                    <>
                        Created APIs using GraphQL (HotChocolate) and optimized
                        database performance with query tuning and caching.
                    </>,
                ],
                images: [
                    {
                        src: "/images/projects/project-01/cover-01.jpg",
                        alt: "Backend architecture project",
                        width: 16,
                        height: 9,
                    },
                ],
            },
            {
                company: "Software Engineer (Personal Projects)",
                timeframe: "Ongoing",
                role: "Developer & Technical Author",
                achievements: [
                    <>
                        Developed open-source projects including a CLI tool in
                        Go with real-time database connectivity and Docker
                        support.
                    </>,
                    <>
                        Wrote technical articles on system scalability,
                        cloud-native design, and backend optimization for
                        personal blog and LinkedIn.
                    </>,
                ],
                images: [],
            },
        ],
    },
    studies: {
        display: true,
        title: "Education",
        institutions: [
            {
                name: "Universidad de San Carlos de Guatemala",
                description: (
                    <>Bachelor’s degree in Computer Systems Engineering.</>
                ),
            },
            {
                name: "Master’s in Cybersecurity and Risk Management (in progress)",
                description: (
                    <>
                        Focused on cloud security, risk assessment, and
                        governance.
                    </>
                ),
            },
        ],
    },
    technical: {
        display: true,
        title: "Technical Skills",
        skills: [
            {
                title: "Backend Development",
                description: (
                    <>
                        Experienced in building scalable APIs with .NET, Go, and
                        Node.js using REST and GraphQL.
                    </>
                ),
                tags: [
                    { name: ".NET", icon: "dotnet" },
                    { name: "Go", icon: "go" },
                    { name: "GraphQL", icon: "graphql" },
                ],
                images: [
                    {
                        src: "/images/projects/project-02/cover-02.jpg",
                        alt: "API Development",
                        width: 16,
                        height: 9,
                    },
                ],
            },
            {
                title: "Cloud & DevOps",
                description: (
                    <>
                        Deploying and maintaining cloud infrastructure with
                        Azure, AWS, and Docker. Applying CI/CD, monitoring, and
                        scalability best practices.
                    </>
                ),
                tags: [
                    { name: "Azure", icon: "azure" },
                    { name: "AWS", icon: "aws" },
                    { name: "Docker", icon: "docker" },
                    { name: "CI/CD", icon: "githubactions" },
                ],
                images: [
                    {
                        src: "/images/projects/project-03/cover-03.jpg",
                        alt: "Cloud architecture diagram",
                        width: 16,
                        height: 9,
                    },
                ],
            },
            {
                title: "Data & Automation",
                description: (
                    <>
                        Experience with ETL processes, Airflow DAGs, and
                        database optimization for PostgreSQL, SQL Server, and
                        NoSQL systems.
                    </>
                ),
                tags: [
                    { name: "PostgreSQL", icon: "postgresql" },
                    { name: "Airflow", icon: "airflow" },
                    { name: "SQL Server", icon: "sqlserver" },
                    { name: "NoSQL", icon: "mongodb" },
                ],
                images: [],
            },
        ],
    },
};

const blog: Blog = {
    path: "/blog",
    label: "Blog",
    title: "Writing about design and tech...",
    description: `Read what ${person.name} has been up to recently`,
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
};

const work: Work = {
    path: "/work",
    label: "Work",
    title: `Projects – ${person.name}`,
    description: `Design and dev projects by ${person.name}`,
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
    path: "/gallery",
    label: "Gallery",
    title: `Photo gallery – ${person.name}`,
    description: `A photo collection by ${person.name}`,
    // Images by https://lorant.one
    // These are placeholder images, replace with your own
    images: [
        {
            src: "/images/gallery/horizontal-1.jpg",
            alt: "image",
            orientation: "horizontal",
        },
        {
            src: "/images/gallery/vertical-4.jpg",
            alt: "image",
            orientation: "vertical",
        },
        {
            src: "/images/gallery/horizontal-3.jpg",
            alt: "image",
            orientation: "horizontal",
        },
        {
            src: "/images/gallery/vertical-1.jpg",
            alt: "image",
            orientation: "vertical",
        },
        {
            src: "/images/gallery/vertical-2.jpg",
            alt: "image",
            orientation: "vertical",
        },
        {
            src: "/images/gallery/horizontal-2.jpg",
            alt: "image",
            orientation: "horizontal",
        },
        {
            src: "/images/gallery/horizontal-4.jpg",
            alt: "image",
            orientation: "horizontal",
        },
        {
            src: "/images/gallery/vertical-3.jpg",
            alt: "image",
            orientation: "vertical",
        },
    ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
