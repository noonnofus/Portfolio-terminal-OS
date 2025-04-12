import AppDesktopHeader from "../layout/AppDesktopHeader";
import { Flex, Image, Heading, Text, Link, Box } from "@chakra-ui/react";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";


export default function AppProjcetWeConnect() {

    return (
        <>
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px 8px 0 0",
            }}>
                <AppDesktopHeader title='Projects' />
            </div>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: "scroll",
                    backgroundColor: "white",
                    borderRadius: "0 0 8px 8px",
                    color: 'black',
                }}
            >
                <Text className="mt-2 mb-2 text-center">Projects</Text>
                <Box
                    width="80%"
                    borderTop="1px solid #ccc"
                    margin="0 auto"
                />
                <Flex
                    flexDir="column"
                    alignItems="center"
                    className="mt-3 mb-3"
                >
                    <Heading
                        fontSize="1.2rem"
                        fontWeight="bold"
                        as="h1"
                        textAlign="center"
                        mb={2}
                    >
                        <Text>Flare: The real-time wildfire alert app</Text>
                    </Heading>
                    <Image
                        src="/images/Flare-logo.png"
                        alt="Flare logo image"
                        boxSize="150px"
                        fit="cover"
                        h="auto"
                        className="mb-2"
                    />
                    <Image
                        src="/images/Flare-homeview.png"
                        alt="Flare home view image"
                        maxHeight={"600px"}
                        fit="cover"
                    />
                    <Link
                        href="https://github.com/BCITKevin/Flare_IDSP"
                        textDecor="underline"
                        mb={3}
                        target="_blank"
                    >
                        GitHub <ExternalLinkIcon />
                    </Link>
                    <Link
                        href="https://www.flare-bc.com/"
                        textDecor="underline"
                        mb={3}
                        target="_blank"
                    >
                        Try Flare <ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Text>
                            This real-time <strong>wildfire alert</strong> app shows the wildfire risk in BC, Canada. Our team focused on people who live in rural areas and have nowhere to get information about wildfires near their homes. <strong>Flare</strong> works on a web-based basis, but it is installable to your phone, since we implemented PWA into it.
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    flexDir="column"
                    alignItems="center"
                    className="mt-8 mb-3"
                >
                    <Heading
                        fontSize="1.2rem"
                        fontWeight="bold"
                        as="h1"
                        textAlign="center"
                        mb={2}
                    >
                        <Text>WeConnect: The video conferencing app with a real-time translating</Text>
                    </Heading>

                    <Image
                        src="/images/construction.png"
                        alt="under construction image"
                        boxSize="150px"
                        fit="cover"
                        h="auto"
                        className="mb-2"
                    />
                    <Image
                        src="/images/construction.png"
                        alt="under construction image"
                        maxHeight={"450px"}
                        fit="cover"
                    />
                    <Link
                        href="https://github.com/BCITKevin/IDSP_weconnect"
                        textDecor="underline"
                        mb={3}
                        target="_blank"
                    >
                        GitHub <ExternalLinkIcon />
                    </Link>
                    <Text>※This might takes more than 1 mintues due to hosting server.</Text>
                    <Link
                        href="https://idsp-weconnect-1.onrender.com/"
                        textDecor="underline"
                        mb={3}
                        target="_blank"
                    >
                        Try WeConnect <ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Text>
                            This is a video conferencing app with a <strong>real-time translation</strong> feature. WeConnect&apos;s target audience includes international students who speak different languages and domestic students who work with other students who speak different languages.
                        </Text>
                    </Flex>
                </Flex>


                <Flex
                    flexDir="column"
                    alignItems="center"
                    className="mt-8 mb-3"
                >
                    <Heading
                        fontSize="1.2rem"
                        fontWeight="bold"
                        as="h1"
                        textAlign="center"
                        mb={2}
                    >
                        <Text>MejuBot: A multi-function Discord bot</Text>
                    </Heading>

                    <Image
                        src="/images/MejuBot.png"
                        alt="MejuBot logo image"
                        boxSize="150px"
                        borderRadius="20%"
                        fit="cover"
                        h="auto"
                        className="mb-2"
                    />
                    <Image
                        src="/images/MejuBot-preview.png"
                        alt="MejuBot preview image"
                        maxHeight={"450px"}
                        fit="cover"
                    />

                    <Link
                        href="https://discord.com/oauth2/authorize?client_id=1263899843055583254&permissions=8&integration_type=0&scope=bot"
                        textDecor="underline"
                        mb={3}
                        target="_blank"
                    >
                        Invite Meju on your Discord server <ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Text>
                            This is a multi-function Discord Bot that helps people play music, see game history, and enjoy simulated stock games. MejuBot is a <strong>verified</strong> bot by <strong>Discord</strong>, and my team was able to get an <strong>&ldquo;Active developer&ldquo;</strong> badge through this. Moreover, this app is already used by around 30 servers and approximately more than 100 people.
                        </Text>
                    </Flex>
                </Flex>
            </div>
        </>
    );
}