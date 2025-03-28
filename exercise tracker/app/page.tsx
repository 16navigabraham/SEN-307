import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddExercise from "@/components/add-exercise"
import ExerciseHistory from "@/components/exercise-history"
import ProgressChart from "@/components/progress-chart"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Exercise Tracker</h1>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="add">Add Exercise</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <AddExercise />
        </TabsContent>

        <TabsContent value="history">
          <ExerciseHistory />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressChart />
        </TabsContent>
      </Tabs>
    </main>
  )
}

