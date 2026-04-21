import { FC } from 'react'

interface StudentProps {
    id: number
    name?: string
}

const Page: FC<StudentProps> = (props) => {
    const propName = props.name
    return (
        <div>
            <main>
                <h1>Hello, student {propName}!</h1>
            </main>
        </div>
    )
}

export default Page
