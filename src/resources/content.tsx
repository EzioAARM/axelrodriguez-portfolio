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
import { getAboutContentSafe } from "@/api/about";
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
    newsletter: {
        display: true,
        title: <>Subscribe to {person.firstName}'s Newsletter</>,
        description: <>My weekly newsletter about creativity and engineering</>,
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
        const imageUrl =
            process.env.STRAPI_IMAGE_URL ||
            process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL;

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
                images: strapiContent.HasCarousel
                    ? strapiContent.Carousel.map((image) => ({
                          id: image.id.toString(),
                          alt: image.alternativeText,
                          caption: image.caption,
                          url: `${imageUrl}${image.large?.url || image.url}`,
                      }))
                    : [],
            },
            newsletter: {
                display: strapiContent.HasNewsletter ?? false,
                title: strapiContent.NewsletterTitle,
                description: strapiContent.NewsletterDescription,
            },
        };
    }

    return staticHome;
}

// Export the static version as default for backward compatibility
const home: Home = staticHome;

// Static about content
const staticAbout: About = {
    path: "/about",
    label: "About",
    title: `About – ${person.name}`,
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    loading: true,
    tableOfContent: {
        display: true,
        subItems: true,
        IntroductionTitle: "Introduction",
        ExperienceTitle: "Experience",
        EducationTitle: "Education",
        TechnicalSkillsTitle: "Technical Skills",
    },
    avatar: {
        display: true,
        image: person.avatar,
        alt: `${person.name} Avatar`,
    },
    calendar: {
        display: false, // puedes activarlo si usas cal.com u otro servicio
        link: "https://cal.com/axelrm/30min",
    },
    intro: {
        display: false,
        title: "Introduction",
        description: "",
    },
    work: {
        display: false,
        title: "Professional Experience",
        experiences: [],
    },
    studies: {
        display: true,
        title: "Education",
        institutions: [],
    },
    technical: {
        display: true,
        title: "Technical Skills",
        skills: [],
    },
    languages: {
        display: true,
        list: [],
    },
    social: {
        display: true,
        links: [],
    },
};

/**
 * Get about content with Strapi integration
 * Falls back to static content if Strapi is unavailable
 */
export async function getAboutPageContent(): Promise<About> {
    const strapiContent = await getAboutContentSafe();

    if (strapiContent) {
        // Convert biography to HTML
        const biographyHtml = await markdownToHtml(strapiContent.Biography);
        const imageUrl =
            process.env.STRAPI_IMAGE_URL ||
            process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL;

        return {
            ...staticAbout,
            loading: false,
            title: `${strapiContent.JobTitle} – ${person.name}`,
            description: strapiContent.seo.metaDescription,
            tableOfContent: {
                display: true,
                subItems: true,
                IntroductionTitle:
                    strapiContent.IntroductionSectionTitle || "Introduction",
                ExperienceTitle:
                    strapiContent.ExperienceSectionTitle || "Experience",
                EducationTitle:
                    strapiContent.EducationSectionTitle || "Education",
                TechnicalSkillsTitle:
                    strapiContent.TechnicalSkillsSectionTitle ||
                    "Technical Skills",
            },
            avatar: {
                display: true,
                image: strapiContent.ProfileImage.formats.large?.url
                    ? `${imageUrl}${strapiContent.ProfileImage.formats.large?.url}`
                    : `${imageUrl}${strapiContent.ProfileImage.url}`,
                alt:
                    strapiContent.ProfileImage.alternativeText ||
                    `${person.name} Profile Image`,
            },
            intro: {
                display: true,
                title: "Introduction",
                description: <SimpleHtmlRenderer html={biographyHtml} />,
            },
            work: {
                display: strapiContent.WorkExperience.length > 0,
                title: "Work Experience",
                experiences: await Promise.all(
                    strapiContent.WorkExperience.map(async (exp) => {
                        return {
                            company: exp.Company,
                            timeframe: exp.Timeframe,
                            role: exp.Role,
                            description: (
                                <SimpleHtmlRenderer
                                    html={await markdownToHtml(exp.Description)}
                                />
                            ),
                        };
                    })
                ),
            },
            studies: {
                display: strapiContent.Studies.length > 0,
                title: "Education",
                institutions: await Promise.all(
                    strapiContent.Studies.map(async (study) => {
                        return {
                            name: study.Name,
                            title: study.Title,
                            timeframe: study.Timeframe,
                            description: (
                                <SimpleHtmlRenderer
                                    html={await markdownToHtml(
                                        study.Description
                                    )}
                                />
                            ),
                        };
                    })
                ),
            },
            technical: {
                display: strapiContent.Skills.length > 0,
                title: "Technical Skills",
                skills: strapiContent.Skills.map((skill) => ({
                    title: skill.Name,
                    level: skill.Level,
                    group: skill.Group,
                })),
            },
            languages: {
                display: strapiContent.Languages.length > 0,
                list: strapiContent.Languages.map((lang) => ({
                    name: lang.Name,
                    level: lang.Level,
                })),
            },
            social: {
                display: true,
                links: strapiContent.SocialLinks.map((link) => ({
                    title: link.Platform,
                    url: link.Url || "",
                    type: link.UseIcon ? "icon" : "custom",
                    icon: link.CssClass || undefined,
                    iconUrl: link.Icon || undefined,
                })),
            },
        };
    }

    return staticAbout;
}

// Export the static version as default for backward compatibility
const about: About = staticAbout;

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

export { person, social, home, about, blog, work, gallery };
