import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { z } from "zod";

// Define Zod schema
const schema = z.object({
  currentAmount: z
    .number()
    .positive("Current amount must be a positive number"),
  previousAmount: z
    .number()
    .positive("Previous amount must be a positive number"),
  kwhRate: z.number().positive("KWH rate must be a positive number"),
});

// Define types for errors
interface Errors {
  currentAmount?: string;
  previousAmount?: string;
  kwhRate?: string;
}

function App() {
  const [amountToPay, setAmountToPay] = useState<string>("0");
  const [currentAmount, setCurrentAmount] = useState<string>("");
  const [previousAmount, setPreviousAmount] = useState<string>("");
  const [kwhRate, setKwhRate] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Parse input values and validate with Zod
    const parsedCurrentAmount = parseFloat(currentAmount);
    const parsedPreviousAmount = parseFloat(previousAmount);
    const parsedKwhRate = parseFloat(kwhRate);

    const result = schema.safeParse({
      currentAmount: parsedCurrentAmount,
      previousAmount: parsedPreviousAmount,
      kwhRate: parsedKwhRate,
    });

    if (result.success) {
      const { currentAmount, previousAmount, kwhRate } = result.data;
      const amount = (currentAmount - previousAmount) * kwhRate;
      setAmountToPay(amount.toFixed(2)); // Round to 2 decimal places
      setErrors({});

      localStorage.setItem("previousAmount", currentAmount.toString());
    } else {
      // Handle errors
      const formattedErrors = result.error.format();
      setErrors({
        currentAmount: formattedErrors.currentAmount?._errors[0],
        previousAmount: formattedErrors.previousAmount?._errors[0],
        kwhRate: formattedErrors.kwhRate?._errors[0],
      });
    }
  };

  const handleReset = () => {
    setCurrentAmount("");
    setPreviousAmount("");
    setKwhRate("");
    setAmountToPay("0");
    setErrors({});
  };

  useEffect(() => {
    const savedPreviousAmount = localStorage.getItem("previousAmount");
    if (savedPreviousAmount) {
      setPreviousAmount(savedPreviousAmount);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <main className="h-[88vh] w-full px-6 flex flex-col items-center justify-center">
        <Card className="-mt-10">
          <CardHeader>
            <CardTitle>Submeter Calculator</CardTitle>
            <CardDescription>
              Calculate the amount to pay based on your current and previous
              meter readings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
                <Label htmlFor="current-amount">Current Amount</Label>
                <Input
                  id="current-amount"
                  type="number"
                  placeholder="Enter current amount"
                  value={currentAmount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCurrentAmount(e.target.value)
                  }
                  step="any" // Accepts decimals
                  className={errors.currentAmount ? "border-red-500" : ""}
                />
                {errors.currentAmount && (
                  <p className="text-red-500 text-sm">{errors.currentAmount}</p>
                )}
              </div>
              <div className="grid grid-cols-1  md:grid-cols-2 items-center gap-2">
                <Label htmlFor="previous-amount">Previous Amount</Label>
                <Input
                  id="previous-amount"
                  type="number"
                  placeholder="Enter previous amount"
                  value={previousAmount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPreviousAmount(e.target.value)
                  }
                  step="any" // Accepts decimals
                  className={errors.previousAmount ? "border-red-500" : ""}
                />
                {errors.previousAmount && (
                  <p className="text-red-500 text-sm">
                    {errors.previousAmount}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
                <Label htmlFor="kwh-rate">KWH Rate</Label>
                <Input
                  id="kwh-rate"
                  type="number"
                  placeholder="Enter KWH rate"
                  value={kwhRate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setKwhRate(e.target.value)
                  }
                  step="any" // Accepts decimals
                  className={errors.kwhRate ? "border-red-500" : ""}
                />
                {errors.kwhRate && (
                  <p className="text-red-500 text-sm">{errors.kwhRate}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
                <Label htmlFor="amount-to-pay">Amount to Pay</Label>
                <div id="amount-to-pay" className="font-medium">
                  PHP {amountToPay}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-col md:flex-row">
                <Button
                  type="button"
                  className="w-full"
                  variant="secondary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button type="submit" className="w-full" variant="default">
                  Calculate
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </ThemeProvider>
  );
}

export default App;
