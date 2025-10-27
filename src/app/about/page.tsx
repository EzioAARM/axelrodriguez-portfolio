import {
    Avatar,
    Button,
    Column,
    Heading,
    Icon,
    IconButton,
    Media,
    Tag,
    Text,
    Meta,
    Schema,
    Row,
    Flex,
    Spinner,
    ProgressBar,
} from "@once-ui-system/core";
import { baseURL, getAboutPageContent, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";

export async function generateMetadata() {
    const aboutContent = await getAboutPageContent();
    return Meta.generate({
        title: aboutContent.title,
        description: aboutContent.description,
        baseURL: baseURL,
        image: `/api/og/generate?title=${encodeURIComponent(
            aboutContent.title
        )}`,
        path: aboutContent.path,
    });
}

export default async function About() {
    const about = await getAboutPageContent();
    const structure = [
        {
            title: about.tableOfContent.IntroductionTitle,
            display: about.intro.display,
            items: [],
        },
        {
            title: about.tableOfContent.ExperienceTitle,
            display: about.work.display,
            items: about.work.experiences.map(
                (experience) => experience.company
            ),
        },
        {
            title: about.tableOfContent.EducationTitle,
            display: about.studies.display,
            items: about.studies.institutions.map(
                (institution) => institution.name
            ),
        },
        {
            title: about.tableOfContent.TechnicalSkillsTitle,
            display: about.technical.display,
            items: [
                ...new Set(about.technical.skills.map((skill) => skill.group)),
            ],
        },
    ];
    if (about.loading) {
        return (
            <Flex fillWidth paddingY="128" horizontal="center">
                <Spinner />
            </Flex>
        );
    }
    return (
        <Column maxWidth="m">
            <Schema
                as="webPage"
                baseURL={baseURL}
                title={about.title}
                description={about.description}
                path={about.path}
                image={`/api/og/generate?title=${encodeURIComponent(
                    about.title
                )}`}
                author={{
                    name: person.name,
                    url: `${baseURL}${about.path}`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />
            {about.tableOfContent.display && (
                <Column
                    left="0"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                    position="fixed"
                    paddingLeft="24"
                    gap="32"
                    s={{ hide: true }}
                >
                    <TableOfContents structure={structure} about={about} />
                </Column>
            )}
            <Row fillWidth s={{ direction: "column" }} horizontal="center">
                {about.avatar.display && (
                    <Column
                        className={styles.avatar}
                        top="64"
                        fitHeight
                        position="sticky"
                        s={{ position: "relative", style: { top: "auto" } }}
                        xs={{ style: { top: "auto" } }}
                        minWidth="160"
                        paddingX="l"
                        paddingBottom="xl"
                        gap="m"
                        flex={3}
                        horizontal="center"
                    >
                        <Avatar
                            src={about.avatar.image}
                            size="xl"
                            title={about.avatar.alt}
                        />
                        <Row gap="8" vertical="center">
                            <Icon onBackground="accent-weak" name="globe" />
                            {person.location}
                        </Row>
                        {about.languages.display &&
                            about.languages.list.length > 0 && (
                                <Row wrap gap="8">
                                    {about.languages.list.map((language) => (
                                        <Tag key={language.name} size="l">
                                            {language.name} ({language.level})
                                        </Tag>
                                    ))}
                                </Row>
                            )}
                    </Column>
                )}
                <Column className={styles.blockAlign} flex={9} maxWidth={40}>
                    <Column
                        id={about.intro.title}
                        fillWidth
                        minHeight="160"
                        vertical="center"
                        marginBottom="32"
                    >
                        {about.calendar.display && (
                            <Row
                                fitWidth
                                border="brand-alpha-medium"
                                background="brand-alpha-weak"
                                radius="full"
                                padding="4"
                                gap="8"
                                marginBottom="m"
                                vertical="center"
                                className={styles.blockAlign}
                                style={{
                                    backdropFilter:
                                        "blur(var(--static-space-1))",
                                }}
                            >
                                <Icon
                                    paddingLeft="12"
                                    name="calendar"
                                    onBackground="brand-weak"
                                />
                                <Row paddingX="8">Schedule a call</Row>
                                <IconButton
                                    href={about.calendar.link}
                                    data-border="rounded"
                                    variant="secondary"
                                    icon="chevronRight"
                                />
                            </Row>
                        )}
                        <Heading
                            className={styles.textAlign}
                            variant="display-strong-xl"
                        >
                            {person.name}
                        </Heading>
                        <Text
                            className={styles.textAlign}
                            variant="display-default-xs"
                            onBackground="neutral-weak"
                        >
                            {person.role}
                        </Text>
                        {social.length > 0 && (
                            <Row
                                className={styles.blockAlign}
                                paddingTop="20"
                                paddingBottom="8"
                                gap="8"
                                wrap
                                horizontal="center"
                                fitWidth
                                data-border="rounded"
                            >
                                {about.social.links.map(
                                    (item) =>
                                        item.url && (
                                            <React.Fragment key={item.title}>
                                                <Row s={{ hide: true }}>
                                                    <Button
                                                        key={item.title}
                                                        href={item.url}
                                                        prefixIcon={item.icon}
                                                        label={item.title}
                                                        size="s"
                                                        weight="default"
                                                        variant="secondary"
                                                    />
                                                </Row>
                                                <Row hide s={{ hide: false }}>
                                                    <IconButton
                                                        size="l"
                                                        key={`${item.title}-icon`}
                                                        href={item.url}
                                                        icon={item.icon}
                                                        variant="secondary"
                                                    />
                                                </Row>
                                            </React.Fragment>
                                        )
                                )}
                            </Row>
                        )}
                    </Column>

                    {about.intro.display && (
                        <Column
                            textVariant="body-default-l"
                            fillWidth
                            gap="m"
                            marginBottom="xl"
                        >
                            {about.intro.description}
                        </Column>
                    )}

                    {about.work.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.work.title}
                                variant="display-strong-s"
                                marginBottom="m"
                            >
                                {about.work.title}
                            </Heading>
                            <Column fillWidth gap="l" marginBottom="40">
                                {about.work.experiences.map(
                                    (experience, index) => (
                                        <Column
                                            key={`${experience.company}-${experience.role}-${index}`}
                                            fillWidth
                                        >
                                            <Row
                                                fillWidth
                                                horizontal="between"
                                                vertical="end"
                                                marginBottom="4"
                                            >
                                                <Text
                                                    id={experience.company}
                                                    variant="heading-strong-l"
                                                >
                                                    {experience.company}
                                                </Text>
                                                <Text
                                                    variant="heading-default-xs"
                                                    onBackground="neutral-weak"
                                                >
                                                    {experience.timeframe}
                                                </Text>
                                            </Row>
                                            <Text
                                                variant="body-default-s"
                                                onBackground="brand-weak"
                                                marginBottom="m"
                                            >
                                                {experience.role}
                                            </Text>
                                            <Row
                                                fillWidth
                                                horizontal="between"
                                                vertical="end"
                                                marginBottom="4"
                                            >
                                                <Text
                                                    wrap="balance"
                                                    onBackground="neutral-weak"
                                                >
                                                    {experience.description}
                                                </Text>
                                            </Row>
                                            {experience.images &&
                                                experience.images.length >
                                                    0 && (
                                                    <Row
                                                        fillWidth
                                                        paddingTop="m"
                                                        paddingLeft="40"
                                                        gap="12"
                                                        wrap
                                                    >
                                                        {experience.images.map(
                                                            (image) => (
                                                                <Row
                                                                    key={
                                                                        image.src
                                                                    }
                                                                    border="neutral-medium"
                                                                    radius="m"
                                                                    minWidth={
                                                                        image.width
                                                                    }
                                                                    height={
                                                                        image.height
                                                                    }
                                                                >
                                                                    <Media
                                                                        enlarge
                                                                        radius="m"
                                                                        sizes={image.width.toString()}
                                                                        alt={
                                                                            image.alt
                                                                        }
                                                                        src={
                                                                            image.src
                                                                        }
                                                                    />
                                                                </Row>
                                                            )
                                                        )}
                                                    </Row>
                                                )}
                                        </Column>
                                    )
                                )}
                            </Column>
                        </>
                    )}

                    {about.studies.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.studies.title}
                                variant="display-strong-s"
                                marginBottom="m"
                            >
                                {about.studies.title}
                            </Heading>
                            <Column fillWidth gap="l" marginBottom="40">
                                {about.studies.institutions.map(
                                    (institution, index) => (
                                        <Column
                                            key={`${institution.name}-${index}`}
                                            fillWidth
                                            gap="4"
                                        >
                                            <Row
                                                fillWidth
                                                horizontal="between"
                                                vertical="end"
                                                marginBottom="4"
                                            >
                                                <Text
                                                    id={institution.name}
                                                    variant="heading-strong-l"
                                                >
                                                    {institution.name}
                                                </Text>
                                                <Text
                                                    variant="heading-default-xs"
                                                    onBackground="neutral-weak"
                                                >
                                                    {institution.timeframe}
                                                </Text>
                                            </Row>
                                            <Text
                                                variant="body-default-s"
                                                onBackground="brand-weak"
                                                marginBottom="m"
                                            >
                                                {institution.title}
                                            </Text>
                                            <Text
                                                variant="heading-default-xs"
                                                onBackground="neutral-weak"
                                            >
                                                {institution.description}
                                            </Text>
                                        </Column>
                                    )
                                )}
                            </Column>
                        </>
                    )}

                    {about.technical.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.technical.title}
                                variant="display-strong-s"
                                marginBottom="40"
                            >
                                {about.technical.title}
                            </Heading>
                            <Column fillWidth gap="l">
                                {about.technical.skills.map((skill) => (
                                    <Column key={skill.title} fillWidth gap="4">
                                        <Row
                                            fillWidth
                                            fitHeight
                                            gap="16"
                                            s={{ direction: "column" }}
                                        >
                                            <Column fillWidth>
                                                <Text
                                                    id={skill.title}
                                                    variant="heading-strong-l"
                                                >
                                                    {skill.title}
                                                </Text>
                                            </Column>
                                            <Column fillWidth center>
                                                <ProgressBar
                                                    value={
                                                        skill.level ===
                                                        "beginner"
                                                            ? 25
                                                            : skill.level ===
                                                              "intermediate"
                                                            ? 50
                                                            : skill.level ===
                                                              "advanced"
                                                            ? 75
                                                            : 100
                                                    }
                                                />
                                            </Column>
                                        </Row>
                                        {skill.tags &&
                                            skill.tags.length > 0 && (
                                                <Row
                                                    wrap
                                                    gap="8"
                                                    paddingTop="8"
                                                >
                                                    {skill.tags.map(
                                                        (tag, tagIndex) => (
                                                            <Tag
                                                                key={`${skill.title}-${tagIndex}`}
                                                                size="l"
                                                                prefixIcon={
                                                                    tag.icon
                                                                }
                                                            >
                                                                {tag.name}
                                                            </Tag>
                                                        )
                                                    )}
                                                </Row>
                                            )}
                                        {skill.images &&
                                            skill.images.length > 0 && (
                                                <Row
                                                    fillWidth
                                                    paddingTop="m"
                                                    gap="12"
                                                    wrap
                                                >
                                                    {skill.images.map(
                                                        (image) => (
                                                            <Row
                                                                key={image.src}
                                                                border="neutral-medium"
                                                                radius="m"
                                                                minWidth={
                                                                    image.width
                                                                }
                                                                height={
                                                                    image.height
                                                                }
                                                            >
                                                                <Media
                                                                    enlarge
                                                                    radius="m"
                                                                    sizes={image.width.toString()}
                                                                    alt={
                                                                        image.alt
                                                                    }
                                                                    src={
                                                                        image.src
                                                                    }
                                                                />
                                                            </Row>
                                                        )
                                                    )}
                                                </Row>
                                            )}
                                    </Column>
                                ))}
                            </Column>
                        </>
                    )}
                </Column>
            </Row>
        </Column>
    );
}
