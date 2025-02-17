"use client";

import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { ArticleT } from "@/models/article";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { Facebook, Instagram, NotepadText, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ArticleCard: React.FC<ArticleT> = (article) => {
    return (
        <Link
            href={`articles/${article.id!}`}
            className={cn(
                "group relative col-span-1 row-span-1 flex cursor-pointer flex-col justify-between overflow-hidden text-white",
                article.type === "important" &&
                    "sm:col-span-2 sm:row-span-2 lg:aspect-square",
                article.type === "notable" && "sm:col-span-2",
            )}
        >
            <img
                src={article.heroImage}
                alt={article.title}
                className="h-full w-full transform object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:blur-sm"
            />
            <div className="absolute top-2 flex w-full justify-between px-2">
                <h4 className="text-xl font-extralight drop-shadow-2xl">
                    {article.creatorUserName}
                </h4>
            </div>
            <div className="absolute bottom-2 left-2 space-y-4">
                <h2
                    className={cn(
                        "text-2xl drop-shadow-2xl",
                        article.type === "important"
                            ? "md:text-5xl"
                            : "md:text-4xl",
                    )}
                >
                    {article.title}
                </h2>
                {article.type === "important" && (
                    <p className="hidden text-lg font-extralight drop-shadow-2xl sm:block">
                        {article.titleDescriptions![0].value}
                    </p>
                )}
            </div>
        </Link>
    );
};

type ArticleGridProps = {
    articles: ArticleT[];
    t: (args: string) => string;
};

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, t }) => {
    const columns = 4;
    const occupiedCells = articles.reduce((total, article) => {
        if (article.type === "important") return total + 4;
        if (article.type === "notable") return total + 2;
        return total + 1;
    }, 0);
    const totalRows = Math.ceil(occupiedCells / columns);
    const totalCells = totalRows * columns;
    const emptyCells = totalCells - occupiedCells;
    const psychologyQuotes = [
        {
            text: "The greatest discovery of my generation is that human beings can alter their lives by altering their attitudes of mind.",
            author: "William James",
        },
        {
            text: "Knowing yourself is the beginning of all wisdom.",
            author: "Aristotle",
        },
        {
            text: "Happiness is not out there for us to find. The reason that it’s not out there is that it’s inside us.",
            author: "Sonja Lyubomirsky",
        },
        {
            text: "To know what people really think, pay attention to what they do, rather than what they say.",
            author: "René Descartes",
        },
        {
            text: "What we achieve inwardly will change outer reality.",
            author: "Plutarch",
        },
        {
            text: "The mind is like an iceberg, it floats with one-seventh of its bulk above water.",
            author: "Sigmund Freud",
        },
        {
            text: "People don’t resist change. They resist being changed!",
            author: "Peter Senge",
        },
        {
            text: "The measure of intelligence is the ability to change.",
            author: "Albert Einstein",
        },
        {
            text: "The best way to predict your future is to create it.",
            author: "Abraham Lincoln",
        },
        {
            text: "Every act of perception is to some degree an act of creation, and every act of memory is to some degree an act of imagination.",
            author: "Gerald M. Edelman",
        },
        {
            text: "The good life is a process, not a state of being. It is a direction not a destination.",
            author: "Carl Rogers",
        },
        {
            text: "Man is not worried by real problems so much as by his imagined anxieties about real problems.",
            author: "Epictetus",
        },
        {
            text: "If you change the way you look at things, the things you look at change.",
            author: "Wayne Dyer",
        },
        {
            text: "You are what you do, not what you say you’ll do.",
            author: "Carl Jung",
        },
        {
            text: "The mind is everything. What you think you become.",
            author: "Buddha",
        },
        {
            text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
            author: "Carl Jung",
        },
        {
            text: "People tend to make rules for others and exceptions for themselves.",
            author: "Anonymous",
        },
        {
            text: "Mental health needs a great deal of attention. It’s the final taboo and it needs to be faced and dealt with.",
            author: "Adam Ant",
        },
        {
            text: "A person’s mind is so powerful. We can invent, create, experience, and destroy things with thoughts alone.",
            author: "Anonymous",
        },
        {
            text: "Cognitive therapy seeks to alleviate psychological tensions by correcting misconceptions.",
            author: "Aaron Beck",
        },
        {
            text: "No matter how much suffering you went through, you never wanted to let go of those memories.",
            author: "Haruki Murakami",
        },
        {
            text: "Your emotions are the slaves to your thoughts, and you are the slave to your emotions.",
            author: "Elizabeth Gilbert",
        },
        {
            text: "A failure is not always a mistake, it may simply be the best one can do under the circumstances. The real mistake is to stop trying.",
            author: "B. F. Skinner",
        },
        {
            text: "You don’t have to control your thoughts. You just have to stop letting them control you.",
            author: "Dan Millman",
        },
        {
            text: "The curious paradox is that when I accept myself just as I am, then I can change.",
            author: "Carl Rogers",
        },
        {
            text: "The primary cause of unhappiness is never the situation but your thoughts about it.",
            author: "Eckhart Tolle",
        },
        {
            text: "We cannot solve our problems with the same thinking we used when we created them.",
            author: "Albert Einstein",
        },
        {
            text: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.",
            author: "Albert Einstein",
        },
        {
            text: "All that we are is the result of what we have thought.",
            author: "Buddha",
        },
        {
            text: "Don’t believe everything you think. Thoughts are just that—thoughts.",
            author: "Allan Lokos",
        },
        {
            text: "The only journey is the one within.",
            author: "Rainer Maria Rilke",
        },
        {
            text: "Our wounds are often the openings into the best and most beautiful part of us.",
            author: "David Richo",
        },
        {
            text: "Even a happy life cannot be without a measure of darkness, and the word happy would lose its meaning if it were not balanced by sadness.",
            author: "Carl Jung",
        },
        {
            text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
            author: "Aristotle",
        },
        {
            text: "Change your thoughts and you change your world.",
            author: "Norman Vincent Peale",
        },
        {
            text: "The greatest weapon against stress is our ability to choose one thought over another.",
            author: "William James",
        },
        {
            text: "Nothing in life is as important as you think it is, while you are thinking about it.",
            author: "Daniel Kahneman",
        },
        {
            text: "Memory is the treasury and guardian of all things.",
            author: "Cicero",
        },
        {
            text: "Nothing is so painful to the human mind as a great and sudden change.",
            author: "Mary Shelley",
        },
        {
            text: "Your perspective on life comes from the cage you were held captive in.",
            author: "Shannon L. Alder",
        },
        {
            text: "A man’s mind is stretched by a new idea or sensation, and never shrinks back to its former dimensions.",
            author: "Oliver Wendell Holmes",
        },
        { text: "Happiness depends upon ourselves.", author: "Aristotle" },
        {
            text: "It is not length of life, but depth of life.",
            author: "Ralph Waldo Emerson",
        },
        {
            text: "Your present circumstances don’t determine where you can go; they merely determine where you start.",
            author: "Nido Qubein",
        },
        {
            text: "Simplicity is the ultimate sophistication.",
            author: "Leonardo da Vinci",
        },
        {
            text: "Man is disturbed not by things, but by the view he takes of them.",
            author: "Epictetus",
        },
        {
            text: "Everything that irritates us about others can lead us to an understanding of ourselves.",
            author: "Carl Jung",
        },
        {
            text: "We are more often frightened than hurt; and we suffer more from imagination than from reality.",
            author: "Seneca",
        },
        {
            text: "Time spent understanding people is never wasted.",
            author: "Cate Huston",
        },
        {
            text: "There is nothing either good or bad, but thinking makes it so.",
            author: "William Shakespeare",
        },
    ];

    function getRandomGardeningQuote() {
        const randomIndex = Math.floor(Math.random() * psychologyQuotes.length);
        return psychologyQuotes[randomIndex];
    }
    const fillerOptions = [
        <Link
            href={"/mission"}
            className="col-span-1 row-span-1 flex flex-col items-center justify-center gap-2 bg-[#525174] text-center font-playfairDSC text-white"
            key="filler-1"
        >
            <NotepadText className="size-8 sm:size-10 lg:size-12" />
            <p className="text-4xl md:text-2xl lg:text-4xl xl:text-5xl">
                {t("mission")}
            </p>
        </Link>,
        <div
            className="col-span-1 row-span-1 flex items-center justify-center gap-4  border-8 border-double border-white bg-gradient-to-b from-[#40916C] to-[#52B788] p-1 text-center text-white"
            key="filler-2"
        >
            <Link
                href={"https://www.instagram.com/varnagardens/"}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Instagram className="size-8 sm:size-10 lg:size-12" />
            </Link>
            <Link
                href={"https://www.youtube.com/@Varnagardens"}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Youtube className="size-8 sm:size-10 lg:size-12" />
            </Link>
            <Link
                href={"https://www.facebook.com/varnagardens"}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Facebook className="size-8 sm:size-10 lg:size-12" />
            </Link>
        </div>,
        <div
            className="col-span-1 row-span-1 flex items-center justify-center border-2 border-[#25BA9E] bg-white p-1 text-center"
            key="filler-3"
        >
            <span className="font-playfairDSC text-4xl text-[#25BA9E] md:text-2xl lg:text-4xl xl:text-5xl">
                Profypsy
            </span>
        </div>,
        <div
            className="col-span-1 row-span-1 flex flex-col items-center justify-center border-8 border-double border-white bg-gradient-to-b from-[#40916C] to-[#52B788] p-2 text-center text-white"
            key="filler-4"
        >
            <span className="line-clamp-4 font-playfairDSC text-lg font-light md:text-2xl">
                &quot;{getRandomGardeningQuote().text}&quot;
            </span>
            {getRandomGardeningQuote().author && (
                <span className="mt-2 block text-sm">
                    - {getRandomGardeningQuote().author}
                </span>
            )}
        </div>,
        // <div
        //     className="col-span-1 row-span-1 flex items-center justify-center rounded-xl bg-yellow-500 text-center"
        //     key="filler-5"
        // >
        //     <span className="text-lg font-bold">Advertisement</span>
        // </div>,
    ];
    const fillers = Array.from({ length: emptyCells }, (_, index) => {
        const randomFiller =
            fillerOptions[Math.floor(Math.random() * fillerOptions.length)];
        return React.cloneElement(randomFiller, { key: `filler-${index}` });
    });
    return (
        <div className="grid-auto-flow-dense grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {articles.map((article, index) => (
                <ArticleCard key={index} {...article} />
            ))}
            {fillers}
        </div>
    );
};

export default function Articles() {
    const [articles, setArticles] = useState<ArticleT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations("Pages.Article");
    useEffect(() => {
        function fetchItems() {
            setIsLoading(true);

            const q = query(
                collection(db, "articles"),
                where("approved", "==", true),
                orderBy("createdAt"),
            );
            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    const articlesList: ArticleT[] = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                ...doc.data(),
                            }) as ArticleT,
                    );
                    setArticles(articlesList);
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error fetching items: ", error);
                    setIsLoading(false);
                },
            );

            return unsubscribe;
        }
        fetchItems();
    }, []);
    return (
        <main className="flex min-h-screen w-full flex-col items-center gap-4 px-4 py-3 lg:px-10">
            <div className="mb-10 mt-4 flex h-fit w-full items-center justify-center bg-contain bg-center bg-no-repeat md:h-screen md:bg-[url('/articles/hero.png')] md:py-10">
                <div className="flex max-w-2xl flex-col items-center space-y-4 rounded-lg text-center backdrop-blur-md md:p-4 md:text-white">
                    <h1 className="rounded font-playfairDSC text-5xl italic">
                        {t("pageTitle")}
                    </h1>
                    <p className="hidden font-nunito text-xl md:block">
                        {t("description")}
                    </p>
                    <Link
                        href="#articles"
                        className=" hidden w-fit rounded-md  bg-[#25BA9E] p-1 px-2 text-white transition-transform hover:scale-105 md:block"
                    >
                        {t("readMore")}
                    </Link>
                </div>
            </div>
            <ArticleGrid articles={articles} t={t} />
        </main>
    );
}
