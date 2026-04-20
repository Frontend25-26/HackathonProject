import {FC} from "react"

interface AdminProps {
    id: number
    name?: string
}

const Page:FC<AdminProps> = (props) => {
    const propName = props.name
    return (
        <div>
            <main>
                <h1>
                    Hello, admin {propName}!
                </h1>
            </main>
        </div>
    )
}

export default Page