import { FC } from 'react'

interface MentorProps {
    id: number
    name?: string
}

const Page: FC<MentorProps> = (props) => {
    const propName = props.name
    return (
        <div>
            <main>
                <h1>Hello, mentor {propName}!</h1>
            </main>
        </div>
    )
}

export default Page
