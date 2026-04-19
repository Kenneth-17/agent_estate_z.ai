from pydantic import BaseModel


class Passport(BaseModel):
    persona: str = ""
    budget_max: int = 99999
    bedrooms_min: int = 0
    property_type_pref: str = ""
    commute_destination: str = ""
    weights: dict = {}
    flags: dict = {}
    onboarding_complete: bool = False
